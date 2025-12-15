export function aixAct(intent, keyData) {
  if (!keyData.automation) {
    return {
      executed: false,
      message: "Automation साठी higher access लागेल"
    };
  }

  return {
    executed: true,
    message: `Intent "${intent}" साठी plan तयार केला आहे`
  };
}
