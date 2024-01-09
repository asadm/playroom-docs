using System;
using UnityEngine;
using UnityEngine.Serialization;

public class PlayerController : MonoBehaviour
{
    [SerializeField] float moveSpeed = 5f;
    [SerializeField] private float jumpAmount = 15f;

    [SerializeField] private Rigidbody2D rb2D;
    [SerializeField] private bool isJumping;

    public float dirX;

    public void Move()
    {
        dirX = Input.GetAxisRaw("Horizontal");
        transform.Translate(new Vector3(dirX, 0, 0) * (moveSpeed * Time.deltaTime));
    }

    public void Jump()
    {
        if (Input.GetButton("Jump") && isJumping)
        {
            rb2D.AddForce(transform.up * jumpAmount, ForceMode2D.Impulse);
            isJumping = false;
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isJumping = true;
        }
    }
}
