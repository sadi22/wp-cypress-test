// Return Lists from the database
export async function getLists() {
  return fetch(window.MRM_Vars.api_base_url + "mrm/v1/lists/")
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

// Return Lists to Custom Select from the database
export async function getListsToDropDown() {
  return fetch(window.MRM_Vars.api_base_url + "mrm/v1/select-lists/")
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

// List delete request
export async function deleteSingleList(id) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/lists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Multiple lists delete request
export async function deleteMultipleListsItems(selected) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/lists/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      list_ids: selected,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Submit list via POST request
export async function submitList(list) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/lists`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(list),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Update list via PUT request
export async function updateList(list) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/lists/${list.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(list),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
