import { useAuth } from "@contexts/AuthContext";
import { FormControlLabel, Stack, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ColorModeContext } from "@pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Logo from "./Logo";

const Navbar = () => {
  const { currentUser, logOut, username } = useAuth();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const router = useRouter();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <Icon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          >
            <FcGallery />
          </Icon> */}
          <Link href="/" passHref>
            <Box
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                color: "red",
                textDecoration: "none",
              }}
            >
              <Logo
                color={
                  theme.mode === "dark" ? theme.palette.secondary.main : "#fff"
                }
              />
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <AiOutlineMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                onClick={() => {
                  setAnchorElNav(null);
                  router.push("/dashboard");
                }}
              >
                <Typography textAlign="center">Dashboard</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  router.push(`/${username}`);
                }}
              >
                <Typography textAlign="center">View Gallery</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  router.push(`/${username}/edit`);
                }}
              >
                <Typography textAlign="center">Edit Gallery</Typography>
              </MenuItem>
            </Menu>
          </Box>
          {/* <Link href="/" passHref>
            <Box
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                color: "red",
                textDecoration: "none",
              }}
            >
              <Logo
                height={18}
                color={
                  theme.mode === "dark" ? theme.palette.secondary.main : "#fff"
                }
              />
            </Box>
          </Link> */}
          <Link href="/" passHref>
            <Box
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
              }}
            >
              <Logo
                color={
                  theme.mode === "dark" ? theme.palette.secondary.main : "#fff"
                }
              />
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => router.push("/dashboard")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Dashboard
            </Button>

            <Button
              id="basic-button"
              sx={{ my: 2, color: "white", display: "block" }}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Gallery
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push(`/${username}`);
                }}
              >
                View Gallery
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push(`/${username}/edit`);
                }}
              >
                Edit Gallery
              </MenuItem>
            </Menu>
          </Box>

          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1, display: { xs: "none", md: "flex" } }}
                checked={theme.palette.mode === "dark"}
                onChange={() => colorMode.toggleColorMode()}
              />
            }
          />

          {currentUser ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUser.displayName}
                    src={currentUser.photoURL}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorElUser(null);
                    router.push("/dashboard");
                  }}
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>

                <MenuItem sx={{ display: { xs: "flex", md: "none" } }}>
                  <Typography textAlign="center">Theme</Typography>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        sx={{ m: 1, ml: 2 }}
                        checked={theme.palette.mode === "dark"}
                        onChange={() => colorMode.toggleColorMode()}
                      />
                    }
                  />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setAnchorElUser(null);
                    logOut();
                  }}
                  sx={{ color: "red" }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Stack direction="row">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.push("/auth/register")}
                sx={{ whiteSpace: "nowrap" }}
              >
                Get Started
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
