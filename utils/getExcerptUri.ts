const getExcerptUri = (
  uri: string,
  startTimeSec: number,
  endTimeSec: number
) => {
  const [part1, part3] = uri.split("upload/");
  const part2 =
    "upload/so_" + startTimeSec + ",du_" + (endTimeSec - startTimeSec) + "/";

  return part1 + part2 + part3;
};

export default getExcerptUri;
