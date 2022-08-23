import { fetchAuth } from "src/frontend-utils/nextjs/utils";

export function registerLead(
  websiteId: number,
  entity: { id: number },
  uuid: null | string
) {
  const requestBody: { website: number; uuid?: string } = {
    website: websiteId,
  };

  if (uuid) {
    requestBody["uuid"] = uuid;
  }

  return fetchAuth(null, `entities/${entity.id}/register_lead/`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}
