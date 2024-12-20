export const translate = (value: string) => {
  switch (value) {
    case "id":
      return "No.";
    case "name":
      return "할 일";
    case "startTime":
      return "시작";
    case "endTime":
      return "종료";
    case "done":
      return "완료 여부";
    default:
      return value;
  }
};
