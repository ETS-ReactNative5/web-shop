import React, { Component } from 'react';
   
class Footer extends React.Component {
    render(){
        return (
  <footer className="footer-area" style={{marginTop:20}}>
				<div className="container">
					<div className="footer-content d-flex flex-column align-items-center">
						<div className="footer-menu">
							<a href="/#/cart" className="yekan" style={{fontSize:12}}>سبد خرید</a>
							<a href="/#/admin/seller" className="yekan" style={{fontSize:12}}>پنل فروشندگان</a>
							<a href="/#/" className="yekan" style={{fontSize:12}}>خانه</a>

						</div>
						<div className="footer-social" style={{background:'#fff','borderRadius': '5px'}}>
							<a target="_blank" href="https://trustseal.enamad.ir/?id=151363&Code=Tgoln44slf1Tu613O4Zs"><img src="https://trustseal.enamad.ir/Content/Images/Star/star1.png?v=5.0.0.47" alt="" style={{"cursor":"pointer"}} id="Tgoln44slf1Tu613O4Zs"/></a>

						</div>
						<div className="copy-right-text yekan" style={{color:'#fff',fontSize:12}}>تمامی حقوق سایت برای فروشگاه آنلاین آنیا محفوظ است</div>

					</div>
				</div>
			</footer>


        )
    }
}
export default Footer;