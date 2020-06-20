import Home from "@/components/HomeIndex";
import Search from "@/components/SearchIndex";
import Signup from "@/components/SignUp";
import Category from "@/components/CategoryIndex";
import Account from "@/components/Account";
import Playlist from "@/components/Playlist";
import Song from "@/components/Song";
import Singer from "@/components/Singer";

const router = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/home",
    component: Home,
    exact: true,
  },
  {
    path: "/search",
    component: Search,
    exact: true,
  },
  {
    path: "/category",
    component: Category,
    exact: true,
  },
  {
    path: "/account",
    component: Account,
    exact: true,
  },
  {
    path: "/singers",
    component: Home,
    exact: true,
  },
  {
    path: "/signup",
    component: Signup,
    exact: true,
  },
  {
    path: "/ranking",
    component: Home,
    exact: true,
  },
];

export default router;
