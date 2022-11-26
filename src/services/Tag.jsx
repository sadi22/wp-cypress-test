//Return tags from tha database
export async function getTags() {
  return fetch(window.MRM_Vars.api_base_url + "mrm/v1/tags/")
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

//Return tags to Custom Select from tha database
export async function getTagsToDropDown() {
  return fetch(window.MRM_Vars.api_base_url + "mrm/v1/select-tags/")
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

// Tag delete request
export async function deleteSingleTag(id) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/tags/${id}`, {
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

// Multiple tags delete request
export async function deleteMultipleTagsItems(selected) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/tags/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      tag_ids: selected,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
