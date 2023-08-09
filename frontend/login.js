const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const div = document.querySelector("#info");

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });

  const data = await res.json();

  console.log("access_token", data);
  //서버에서 회원가입이 성공했을 때
  if (res.status === 200) {
    alert("로그인에 성공했습니다");
    console.log(res.status);
  } else if (res.status === 401) {
    alert("로그인 실패");
    console.log(res.status);
  }
  //   window.location.pathname = "/login.html";
};

form.addEventListener("submit", handleSubmit);
