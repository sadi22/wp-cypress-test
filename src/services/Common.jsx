// Create new tag/list if search items not match
export async function createNewGroup(endpoint, item) {
    return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(item),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
}