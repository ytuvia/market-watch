// material-ui
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/logo.jpg';
import {Typograph, Box} from '@mui/material';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <Box 
      sx={{
        backgroundImage:`url(${logo})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "57px",
        width: "200px"
        }}
      >
    </Box>
  );
};

export default Logo;
