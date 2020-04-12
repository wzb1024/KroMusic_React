import Home from "@/components/HomeIndex";
import Search from "@/components/SearchIndex";
import SignUp from "@/components/SignUp";
import Category from "@/components/CategoryIndex";
import Account from "@/components/Account";
import Playlist from "@/components/Playlist";

const router = [
  {
    path: "/",
    component: Home,
    exact: true
  },
  {
    path: "/home",
    component: Home,
    exact: true
  },
  {
    path: "/search",
    component: Search,
    exact: true
  },
  {
    path: "/category",
    component: Category,
    exact: true
  },
  {
    path: "/account",
    component: Account,
    exact: true
  },
  {
    path: "/singer",
    component: Home,
    exact: true
  },
  {
    path: "/signUp",
    component: SignUp,
    exact: true
  },
  {
    path: "/ranking",
    component: Home,
    exact: true
  }
];

export default router;
