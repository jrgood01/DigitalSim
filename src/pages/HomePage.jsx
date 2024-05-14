//import App.css
import '../App.css';
import { Button } from 'antd';

function HomePage() {
    return (
        <div class="Background">
            <div class="CenterBox"> 
                <h1>DIGITAL SIM</h1>
                <div style={{display: "inline-block"}}>
                    <a href="/login">
                        <Button type="primary" size='lg' style={{width: '150px', height: "60px", marginTop: "40px",  backgroundColor: "#55f"}}>Login</Button>
                    </a>
                    <a href="/SignUp">
                        <Button type="default" size='lg' style={{width: '150px', height: "60px", marginTop: "40px", borderColor: "#55f", color: "white", backgroundColor:"#282c34"}}>SignUp</Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;