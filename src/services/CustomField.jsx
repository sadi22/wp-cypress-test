// Return all custom fields from the database
export async function getCustomFields() {
  return fetch(window.MRM_Vars.api_base_url + "mrm/v1/settings/custom-fields/")
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

// Custom fields submit post request
export async function submitCustomFields(customFields) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/settings/custom-fields`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(customFields),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Custom fields delete request
export async function deleteSingleCustomField(id) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/settings/custom-fields/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Custom fields update put request
export async function updateCustomFields(customField) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/settings/custom-fields/${customField.id}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(customField),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
