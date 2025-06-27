import Header from "../css/Header.module.css";
import logo from "../images/withgo.svg";
import logout from "../images/Logout.svg";

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// const KAKAO_LOGOUT_URL =
//   `https://kauth.kakao.com/oauth/logout?client_id=${
//     import.meta.env.VITE_KAKAO_CLIENT_ID
//   }` + `&logout_redirect_uri=${import.meta.env.VITE_KAKAO_LOGOUT_REDIRECT_URI}`;

function header() {
  const navigate = useNavigate();

  const Logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // const Logout = async () => {
  //   await supabase.auth.signOut();
  //   window.location.href = KAKAO_LOGOUT_URL;
  // };

  return (
    <div className={Header.content}>
      <div className={Header.title}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <button className={Header.logout} onClick={Logout}>
          <img src={logout} alt="" />
        </button>
      </div>
      <div className={Header.menu}>
        <Link to="/delivery">배송</Link>
        <Link to="/storage">보관</Link>
        <Link to="/">조회</Link>
      </div>
    </div>
  );
}

export default header;
