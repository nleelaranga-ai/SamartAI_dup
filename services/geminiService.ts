const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function getUserId() {
  let uid = localStorage.getItem("samartai_user");
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem("samartai_user", uid);
  }
  return uid;
}

export async function sendMessageToAI(message: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      user_id: getUserId()
    })
  });

  if (!res.ok) {
    throw new Error("Backend not responding");
  }

  const data = await res.json();
  return data.reply;
}
