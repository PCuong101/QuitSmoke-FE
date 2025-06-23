
import * as iconFeature from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

function BoxValue(props){
    return (
        <div className="box-value">
            <h2>{props.value}</h2>
            <p>{props.description}</p>
        </div>
    );
}

function BoxAchievement(props){
    return (
        <div className="box-achievement">
            <div className="icon-container">
                <props.icon className="icon" size={35}/>
            </div>
            <h4>{props.value}</h4>
            <p>{props.description}</p>
        </div>
    );
}

function Benefit(props){
    return (
        <div className="benefit" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <props.icon className="icon" size={35}/>
            <h4 style={{padding: '0 10px'}}>{props.value}</h4>
        </div>
    );
}

function Story(props){
    return (
        <div className="story">
            <img src={props.image} alt={props.alt} />
             <div className="flex space-x-1">
      {[...Array(props.star)].map((_, i) => (
        <iconFeature.Star key={i} style={{color:'yellow', fill:'yellow'}} />
      ))}
    </div>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            <h5>{props.name}</h5>
        </div>
    );
}



function HomePage() {
    const navigate = useNavigate();

    return (
        <>
        <div id="header">
        <h1>Nền tảng <strong>Cai nghiện</strong> thuốc lá</h1>
        <p>Hành trình cai nghiện thuốc lá của bạn bắt đầu từ đây. Theo dõi tiến độ, hoàn thành nhiệm vụ, và nhận được sự hỗ trợ từ chuyên gia và cộng đồng,</p>
        <button id="button-left" onClick={() => navigate('/survey')}>Bắt đầu ngay miễn phí</button>
        <button id="button-right" onClick={() => navigate("/service-package")}>Xem gói dịch vụ</button>
        <h4>Đã có tài khoản? <a href='/login'>Đăng nhập ngay</a></h4>
        </div>

        <div id="box-container">
        <BoxValue id="box-left" value="85%" description="Tỷ lệ thành công"></BoxValue>
        <BoxValue id="box-left" value="30 ngày" description="Thời gian trung bình"></BoxValue>
        <BoxValue id="box-left" value="24/7" description="Hỗ trợ mọi lúc"></BoxValue>
        </div>

        <div>
        <h1>Tính năng nổi bật</h1>
        <p style={{paddingBottom : '20px'}}>Hệ thống hỗ trợ toàn diện giúp bạn cai thuốc lá thành công và duy trì lối sống lành mạnh.</p>    
        </div>

        <div id="box-achievement-container">
            <BoxAchievement icon={iconFeature.Target} value="Theo dõi tiến độ" description="Ghi lại và theo dõi quá trình cai thuốc của bạn."></BoxAchievement>
            <BoxAchievement icon={iconFeature.Trophy} value="Nhiệm vụ hàng ngày" description="Hoàn thành các thử thách để duy trì động lực và xây dựng thói quen tốt."></BoxAchievement>
            <BoxAchievement icon={iconFeature.Users} value="Cộng đồng hỗ trợ" description="Kết nối với những người có cùng mục tiêu và chia sẻ kinh nghiệm."></BoxAchievement>
        </div>

        <div id="box-achievement-container">
            <BoxAchievement icon={iconFeature.Brain} value="Quản lý cơn thèm" description="Công cụ phân tích và kiểm soát cơm thèm thuốc lá hiệu quả."></BoxAchievement>
            <BoxAchievement icon={iconFeature.MessageCircle} value="Chat & Tư vấn" description="Trò chuyện với cộng đồng và nhận tư vấn từ chuyên gia."></BoxAchievement>
            <BoxAchievement icon={iconFeature.Calendar} value="Lịch hẹn chuyên gia" description="Đặt lịch tư vấn trực tiếp với các chuyên gia y tế."></BoxAchievement>
        </div>

        <div id="benefit-container">
        <h1>Lợi ích khi cai thuốc lá</h1>
        <p>Những thay đổi tích cực mà bạn sẽ nhận được khi bỏ thuốc lá</p>
        <div className="benefit-box">
            <div className="benefit-column">
            <Benefit icon={iconFeature.Heart} value="Cải thiện sức khỏe tim mạch và phổi"></Benefit>
            <Benefit icon={iconFeature.Award} value="Tăng cường sự tự và ý chí"></Benefit>
            </div>
            <div className="benefit-column">
            <Benefit icon={iconFeature.CircleDollarSign} value="Tiết kiệm chi phí mua thuốc lá"></Benefit>
            <Benefit icon={iconFeature.Shield} value="Bảo vệ sức khỏe gia đình"></Benefit>
            </div>
        </div>
        
        </div>
        <h1>Câu chuyện thành công</h1>
        <div id="story-container">
            <Story className="story-box" image="https://via.placeholder.com/150" alt="Người dùng 1" star={5} title="Câu chuyện thành công" description="Tôi đã cai thuốc lá sau 10 năm hút thuốc. Nhờ có nền tảng này, tôi đã vượt qua được những cơn thèm thuốc và giờ đây tôi cảm thấy khỏe mạnh hơn bao giờ hết." name="Nguyễn Văn A"></Story>
            <Story className="story-box" image="https://via.placeholder.com/150" alt="Người dùng 2" star={4} title="Hành trình cai thuốc" description="Tôi đã thử nhiều lần nhưng không thành công. Nhưng với sự hỗ trợ từ cộng đồng và chuyên gia, tôi đã cai thuốc thành công." name="Trần Thị B"></Story>
        </div>

        <div className="hero-section">
      <h1 className="hero-title">Sẵn sàng thay đổi cuộc sống?</h1>
      <p className="hero-subtitle">
        Hãy bắt đầu hành trình cai thuốc lá của bạn ngay hôm nay. Hàng ngàn người đã thành công, bạn cũng có thể!
      </p>
      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => navigate("/survey")}>Bắt đầu miễn phí ngay</button>
        <button className="btn-secondary" onClick={() => navigate("/service-package")}>Xem gói dịch vụ</button>
      </div>
    </div>

        <Footer />
        </> 
    );
}
export default HomePage;