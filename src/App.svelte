<script>
  import Login from "./pages/Login.svelte";
  import Main from "./pages/Main.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import Signup from "./pages/Signup.svelte";
  import Write from "./pages/Write.svelte";
  import Router from "svelte-spa-router";
  import "./css/style.css";
  import { user$ } from "./stroe";
  import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
  } from "firebase/auth";
  import { onMount } from "svelte";
  import Loading from "./pages/Loading.svelte";
  import MyPage from "./pages/MyPage.svelte";

  let isLoading = true;

  const auth = getAuth();

  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    // if (!token) return (isLoading = false);
    //이렇게 작성하게 되면, 계속 로딩중 화면만 보임
    //밑에 처럼{}처리를 해주니까 적용됨

    if (!token) {
      return (isLoading = false);
    }
    // credential(idtoken,accesstoken)
    //idtoken은 사용하지 않으니까 null
    const credential = GoogleAuthProvider.credential(null, token);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;
    user$.set(user);
    isLoading = false;
  };

  const routes = {
    "/": Main,
    "/signup": Signup,
    "/write": Write,
    "/my": MyPage,
    "*": NotFound,
  };

  onMount(() => checkLogin());
</script>

{#if isLoading}
  <Loading />
{:else if !$user$}
  <Login />
{:else}
  <Router {routes} />
{/if}
