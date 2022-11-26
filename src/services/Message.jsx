// Contact note submit post request
export async function submitEmail(email, contactId) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${contactId}/send-message`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(email),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
