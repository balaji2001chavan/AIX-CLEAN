import fetch from "node-fetch";

export async function deployToRender(apiKey, serviceId) {
  const response = await fetch(
    `https://api.render.com/v1/services/${serviceId}/deploys`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    }
  );

  return await response.json();
}
