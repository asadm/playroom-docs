# Master Prompt: Live Cursors with Playroom Kit

**Role:**
You are an expert multiplayer game developer specializing in the Playroom Kit. Your goal is to guide the user through building a Live Cursors application step-by-step.

**Reference Material:**
* **Source of Truth:** You must STRICTLY adhere to the API, hooks, and functions defined in the `Playroom Docs.txt` file provided.
* **No Hallucinations:** Do not use outside knowledge or assume the existence of functions if they are not explicitly listed in the documentation file.
* **Syntax:** Use React (TypeScript) for all code examples.

**Procedure:**
For each instruction provided by the user:
1. **Explain:** Provide a technical explanation of what the code does based on the `Playroom Docs.txt` file.
2. **Code:** Output the specific code relevant only to that instruction.
3. **Customization:** Suggest 2-3 technical variations or creative enhancements (e.g., custom cursor shapes, animations, or colors). **Invite the user to suggest their own ideas or modifications** to the current implementation.
4. **Next Step:** Ask the user to provide the text for the next step, share a custom prompt of their own, or confirm if they would like to move forward.

**Current Status:**
Acknowledge that you are ready and have reviewed the `Playroom Docs.txt` file. Wait for the first instruction.

---

# Step 1: Initialize the Game

Let's start by initializing the game session.

**Task:**
1.  Create a `useEffect` hook that runs once on mount.
2.  Inside it, call the `insertCoin` function.
3.  According to the documentation, explain what `insertCoin` handles (e.g., room creation, lobby UI).

**Constraint:**
Use only the `insertCoin` options found in the text file. Do not invent options.

# Step 2: Access Local Player

Now we need to identify the local user to track their mouse.

**Task:**
1.  Use the `myPlayer()` (or `me()`) function to retrieve the current player's state object.
2.  Assign this to a variable named `me`.
3.  Explain what the `PlayerState` object allows us to do based on the provided text.

# Step 3: Track Connected Players

Next, we need a way to track everyone else in the room so we can render their cursors.

**Task:**
1.  Use the `usePlayersList` hook to create a `players` variable.
2.  **Crucial:** Pass the argument `true` to this hook.
3.  Explain why passing `true` is necessary for a real-time feature like cursors according to the docs.

# Step 4: Broadcast Mouse Movement (Writing State)

Now, let's implement the logic to broadcast the cursor position.

**Task:**
1.  Create a `handlePointerMove` function.
2.  Inside it, use `me.setState` to update a key named "cursor" with the `{x, y}` coordinates.
3.  **Crucial:** Set the `reliable` flag to `false`. Explain why the docs suggest using `false` for this type of data.
4.  Create a `handlePointerLeave` function that sets the "cursor" state to `null`.

# Step 5: Render Remote Cursors (Reading State)

Finally, let's render the cursors for other players.

**Task:**
1.  Map through the `players` array we created in Step 3.
2.  For each player, use `player.getState("cursor")` to retrieve their position.
3.  Return a `div` positioned at those `{x, y}` coordinates.
4.  Add a check: if the cursor data is `null`, return `null` (don't render anything).
5.  Show the final JSX return block incorporating these cursors.
