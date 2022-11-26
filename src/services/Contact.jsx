// Return Contacts from the database
export async function getContacts() {
  return fetch(window.MRM_Vars.api_base_url + `mrm/v1/contacts/`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (200 == data.code) {
        return data.data;
      }
    });
}
// Delete a single contact
export async function deleteSingleContact(id) {
  return fetch(window.MRM_Vars.api_base_url + `mrm/v1/contacts/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Multiple lists delete request
export async function deleteMultipleContactsItems(selected) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/contacts/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      contact_ids: selected,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Contact submit or create post request
export async function createContact(contact) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/contacts/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(contact),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

