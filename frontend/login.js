const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256Password = sha256(formData.get("password"));
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });

  const data = await res.json();
  const access_token = data.access_token;
  console.log(access_token);
  //로컬 스토리지에 토큰을 저장

  //브라우저를 닫았다 열어도 토큰값을 유지시키고 싶을때-로컬스토리지
  window.localStorage.setItem("token", access_token);
  //브라우저를 닫았다 열면 토큰값이 사라짐-세션스토리지
  //window.sessionStorage.setItem("token", access_token);

  alert("로그인 성공");
  window.location.pathname = "/";

  // const div = document.querySelector("#info");
  // div.innerText = "로그인 성공";

  //window.location.pathname = "/";

  //   const btn = document.createElement("button");
  //   btn.innerText = "상품 가져오기";
  //   btn.addEventListener("click", async () => {
  //     const res = await fetch("/items", {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   });

  //   div.appendChild(btn);
};

form.addEventListener("submit", handleSubmit);
