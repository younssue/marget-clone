<script>
  import Nav from "../components/Nav.svelte";
  import { user$ } from "../stroe";

  const logout = () => {
    //1.유저정보 지워주기
    //2.localstoarge 비워주기

    user$.set(null);
    localStorage.removeItem("token");
  };
</script>

<div>나의 당근</div>
<button class="logout-btn" on:click={logout}>로그아웃</button>
<Nav location="my" />

<style>
  .logout-btn {
    border: 1px solid gray;
    cursor: pointer;
  }
</style>
