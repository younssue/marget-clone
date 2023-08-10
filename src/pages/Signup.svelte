<form id="signup-form" action="/signup" method="post">
  <div>회원가입</div>
  <div>
    <label for="id"> 아이디 </label>
    <input type="text" id="id" name="id" required />
  </div>
  <div>
    <label for="id"> 비밀번호 </label>
    <input type="password" id="password" name="password" required />
  </div>
  <div>
    <label for="id"> 비밀번호 확인 </label>
    <input type="password" id="password2" name="password2" required />
  </div>
  <div>
    <label for="id"> 이름 </label>
    <input type="text" id="name" name="name" required />
  </div>
  <div>
    <label for="email"> 이메일 </label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <button type="submit">회원 가입</button>
  </div>
  <div id="info" style="color: red" />
</form>
