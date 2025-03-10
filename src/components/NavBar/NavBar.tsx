import React, { useState, MouseEvent } from 'react';
import { Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newSelected: string | null) => {
    setSelected(newSelected);
  };

  return (
    <div>
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={handleToggleChange}
        aria-label="navbar-buttons"
      >
        <ToggleButton value="home" component={Link} to="/" startIcon={<HomeIcon />}>
          Home
        </ToggleButton>

        <ToggleButton value="timeline" component={Link} to="/timeline">
          Spell Timeline
        </ToggleButton>

        <ToggleButton
          value="graphs"
          onClick={handleMenuOpen}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}
        >
          Graphs <ArrowDropDownIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem component={Link} to="/graphs" onClick={handleMenuClose}>
          All Graphs
        </MenuItem>
        <MenuItem component={Link} to="/graphs/external-comparison" onClick={handleMenuClose}>
          Absorb vs. Damage Reduction
        </MenuItem>
        <MenuItem component={Link} to="/graphs/spellpower-comparison" onClick={handleMenuClose}>
          Sheilun's Gift vs. Jade Empowerment
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NavBar;
