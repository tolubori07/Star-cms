"use server";

import { createEntryAction, editEntryAction, deleteEntryAction } from "@/app/entry/actions";

export async function createEntryProxy(collectionId: string, data: any) {
  return await createEntryAction(collectionId, data);
}

export async function editEntryProxy(id: string, data: any) {
  return await editEntryAction(id, data);
}

export async function deleteEntryProxy(id: string) {
  return await deleteEntryAction(id);
}

