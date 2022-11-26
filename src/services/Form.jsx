// Return form templates from the database based on query params
export async function getAllTemplates(page, perPage) {
  return fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/forms/get-form-templates?page=${page}&per-page=${perPage}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Return single form template data from the database
export async function getSingleTemplate(id) {
  return fetch(
    `https://d-aardvark-fufe.instawp.xyz/wp-json/mha/v1/forms/${id}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// POST request to create new form
export async function createNewForm(form) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/forms`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(form),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
