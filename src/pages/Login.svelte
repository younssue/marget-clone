<!-- <form id="login-form" action="/login" method="post">
  <div>로그인</div>
  <div>
    <label for="id"> 아이디 </label>
    <input type="text" id="id" name="id" required />
  </div>
  <div>
    <label for="id"> 비밀번호 </label>
    <input type="password" id="password" name="password" required />
  </div>
  <div>
    <div>
      <button type="submit">로그인</button>
    </div>
    <div id="info" />
  </div>
</form> -->

<!-- 구글 로그인 -->

<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { user$ } from "../stroe";
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);

      //store.js 에 프론트단에서 user정보를 저장한다
      user$.set(user);

      //localstorge에 저장
      localStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
    }
  };
</script>

<div>
  <!-- 로그인한 유저가 있으면 보여주고, 아니면 보이지 않기 -->
  <!-- {#if $user$}
  $user$?.displayName : 유저이름이 있으면 보여주고 아니면, undefinded 
    <div>{$user$?.displayName}</div>
  {/if} -->
  <div>로그인</div>
  <button class="login-btn" on:click={loginWithGoogle}>
    <img
      class="googleLogo"
      src="https://e7.pngegg.com/pngimages/326/85/png-clipart-google-logo-google-text-trademark.png"
      alt=""
    />
    <div>Google로 시작하기</div>
  </button>
</div>

<style>
  .login-btn {
    width: 200px;
    height: 50px;
    border: 1px solid gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
  }
  .googleLogo {
    width: 20px;
  }
</style>
