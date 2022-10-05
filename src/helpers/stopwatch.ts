export async function calcExecuteTime(id: string, func: Promise<any>) {
  console.time(id);
  const res = await func;
  console.timeEnd(id);

  return res;
}
