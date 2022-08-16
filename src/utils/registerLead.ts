import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";

export function registerLead(
  authToken:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | null
    | undefined,
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

  return fetchAuth(authToken, `entities/${entity.id}/register_lead/`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}
