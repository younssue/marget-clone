const handleSubmitForm = async (event) => {
  event.preventDefault();
  //event.preventDefault();: 이 부분은 이벤트의 기본 동작을 취소합니다.
  //폼이 제출될 때 기본적으로 페이지가 새로고침되거나 새로운 페이지로 이동하는 것을 막습니다.
  //이렇게 함으로써 JavaScript 코드에서 폼 제출을 더 세밀하게 제어할 수 있습니다.

  //body 는 wirte FormData를 가져오는데
  // 그 중 insertAt은 현재 시간을 new Date().getTime()을 이용해 자동작성되게 해준다
  const body = new FormData(form);
  // 세계시간 기준
  body.append("insertAt", new Date().getTime());

  try {
    const res = await fetch("/items", {
      method: "POST",
      body,
      // body:body, -> 이렇게 작성하지 않아도 body, 라고 작성해도 괜찮음
    });
    // 글쓰기가 등록되고 200번을 리턴해줌
    //data === 200 일 때 (글쓰기가 성공했을때) main으로 다시 이동
    const data = await res.json();
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error(e);
  }
};
const form = document.getElementById("write-form");
form.addEventListener("submit", handleSubmitForm);
