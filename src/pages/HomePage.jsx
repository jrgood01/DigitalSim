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
                        <Button type="primary" size='lg' style={{width: '150px', height: "60px", marginTop: "50px"}}>Login</Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;