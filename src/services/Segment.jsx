// Return Lists to index page from the database based on query params
export async function getAllSegments(orderBy, orderType, page, perPage, query) {
  return fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/segments?order-by=${orderBy}&order-type=${orderType}&page=${page}&per-page=${perPage}${query}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// List delete request
export async function deleteSingleSegment(id) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/segments/${id}`, {
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
export async function deleteMultipleSegmentItems(selected) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/segments/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      segment_ids: selected,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Campaign submit post request
export async function submitSegment(segment) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/segments`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(segment),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
