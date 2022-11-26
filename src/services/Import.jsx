// Return all roles from the native WordPress
export async function getWordPressRoles() {
  return fetch(
    window.MRM_Vars.api_base_url + "mrm/v1/contacts/import/native/wp/roles"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (200 === data.code) {
        return data.data;
      }
    });
}

// Handle WordPress role submission to get contacts
export async function submitWordPressRoles(wp_roles) {
  let roles = {
    roles: wp_roles,
  };
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/contacts/import/native/wp`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(roles),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
