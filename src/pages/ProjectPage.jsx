import React from 'react';
import '../App.css';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import ToolboxComponent from '../simulator/ToolboxComponent';
import { faSearchPlus, faSearchMinus, faArrowsAlt, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimulationComponent from '../simulator/SimulationComponent';

function ProjectPage() {
    return (
        <div className="Background-no-grid">
            <Navbar className="custom-navbar" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Dropdown className="custom-navbar">
                            <Dropdown.Toggle id="dropdown-basic">
                                File
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="custom-navbar">
                                <Dropdown.Item href="#/New">New</Dropdown.Item>
                                <Dropdown.Item href="#/Open">Open</Dropdown.Item>
                                <Dropdown.Item href="#/Save">Save</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                    <Nav className="mr-auto">
                        <Dropdown className="custom-navbar">
                            <Dropdown.Toggle id="dropdown-basic">
                                Settings
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="custom-navbar">
                                <Dropdown.Item href="#/New">Simulation</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="icon-container">
                <FontAwesomeIcon icon={faArrowsAlt} className="icon" /> {/* Pan */}
                <FontAwesomeIcon icon={faSearchPlus} className="icon" /> {/* Zoom In */}
                <FontAwesomeIcon icon={faSearchMinus} className="icon" /> {/* Zoom Out */}
                <FontAwesomeIcon icon={faCrosshairs} className="icon" /> {/* Center */}
            </div>
            <ToolboxComponent />
            <SimulationComponent/>
        </div>
    );
};

export default ProjectPage;