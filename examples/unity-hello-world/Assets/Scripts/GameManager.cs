using System;
using System.Collections.Generic;
using AOT;
using Playroom;
using UnityEngine;
using Random = UnityEngine.Random;

public class GameManager : MonoBehaviour
{
    private static readonly List<PlayroomKit.Player> players = new();
    private static readonly List<GameObject> playerGameObjects = new();

    private static Dictionary<string, GameObject> PlayerDict = new();

    [SerializeField] private static bool playerJoined;


    private void Awake()
    {
        PlayroomKit.InitOptions options = new PlayroomKit.InitOptions
        {
            allowGamepads = false,
            maxPlayersPerRoom = 4,
            skipLobby = false,
        };

        PlayroomKit.InsertCoin(() =>
        {
            PlayroomKit.OnPlayerJoin(AddPlayer);
        }, options);
    }


    private void Update()
    {
        if (playerJoined)
        {
            var myPlayer = PlayroomKit.MyPlayer();
            var index = players.IndexOf(myPlayer);

            playerGameObjects[index].GetComponent<PlayerController>().Move();
            playerGameObjects[index].GetComponent<PlayerController>().Jump();

            players[index].SetState("posX", playerGameObjects[index].GetComponent<Transform>().position.x);
            players[index].SetState("posY", playerGameObjects[index].GetComponent<Transform>().position.y);

        }

        for (var i = 0; i < players.Count; i++)
        {

            if (players[i] != null)
            {
                var posX = players[i].GetState<float>("posX");
                var posY = players[i].GetState<float>("posY");
                Vector3 newPos = new Vector3(posX, posY, 0);

                if (playerGameObjects != null)
                    playerGameObjects[i].GetComponent<Transform>().position = newPos;
            }

        }
    }

    public static void AddPlayer(PlayroomKit.Player player)
    {
        GameObject playerObj = (GameObject)Instantiate(Resources.Load("Player"),
            new Vector3(Random.Range(-4, 4), Random.Range(1, 5), 0), Quaternion.identity);

        // player color based on profile's color
        playerObj.GetComponent<SpriteRenderer>().color = player.GetProfile().color;
        Debug.Log(player.GetProfile().name + " Joined the game!" + "id: " + player.id);

        PlayerDict.Add(player.id, playerObj);
        players.Add(player);
        playerGameObjects.Add(playerObj);

        playerJoined = true;

        player.OnQuit(RemovePlayer);
    }

    [MonoPInvokeCallback(typeof(Action<string>))]
    private static void RemovePlayer(string playerID)
    {
        if (PlayerDict.TryGetValue(playerID, out GameObject player))
        {
            Destroy(player);
        }
        else
        {
            Debug.LogWarning("Player not in dictionary!");
        }

    }
}