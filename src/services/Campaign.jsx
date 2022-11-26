// Campaign submit post request
export async function submitCampaign(campaign) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/campaigns`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(campaign),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Campaign delete request
export async function deleteSingleCampaign(id) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/campaigns/${id}`, {
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

// Campaign delete request
export async function deleleMultipleCampaigns(selected) {
  return await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/campaigns/`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      campaign_ids: selected,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Delete a campaign email
export async function deleteCampaignEmail(campaign_id, email_id) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/campaigns/${campaign_id}/email/${email_id}`,
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

// Return all campaigns from the database
export async function getAllCampaigns(
  page,
  perPage,
  query,
  orderBy,
  orderType
) {
  return fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/campaigns?order-by=${orderBy}&order-type=${orderType}&page=${page}&per-page=${perPage}${query}`
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

// Campaign update put request
export async function updateCampaignRequest(campaign) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/campaigns/${campaign.campaign_id}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(campaign),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}

// Update campaign status
export async function updateCampaignStatus(campaign) {
  return await fetch(
    `${window.MRM_Vars.api_base_url}mrm/v1/campaigns/${campaign.campaign_id}/status-update`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(campaign),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
}
