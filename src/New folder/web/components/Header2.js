import React, { Component } from 'react';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import { Navbar, Dropdown, Nav, Icon, Sidenav, Toggle } from 'rsuite';
import { Sidebar } from 'primereact/sidebar';
import { connect } from 'react-redux';
import Server from './Server.js'
import { Loader } from 'rsuite';


class Header2 extends React.Component {
	constructor(props) {
		super(props);
		this.Server = new Server();

		this.state = {
			Obj: {},
			img: null,
			Cat: [],
			Theme: null,
			money: "",
			id: null,
			activeKey: null,
			expanded: false,
			OpenSideBar: false,
			Navs: [],
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl()
		}
		this.GoToProduct = this.GoToProduct.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.getNav = this.getNav.bind(this);
		this.getSettings();
		this.RefCats = React.createRef();

	}
	handleToggle() {
		this.setState({
			expanded: !this.state.expanded
		});
	}
	handleSelect(eventKey) {
		this.setState({
			activeKey: eventKey
		});
	}
	getSettings() {
		axios.post(this.state.url + 'getSettings', {
			token: localStorage.getItem("api_token")
		})
			.then(response => {
				this.getNav();
				this.setState({
					Theme: response.data.result ? response.data.result.Theme : "1"
				})
			})
			.catch(error => {
				this.getNav();
			})
	}
	getNav() {
		let that = this;

		that.Server.send("AdminApi/getNavs", {}, function (response) {
			var result = []
			that.setState({
				loading: 0
			})
			that.getCategory();

			response.data.result.map(function (v, i) {
				result.push({
					_id: v._id,
					title: v.title,
					link: v.link,
					order: v.order

				})
			})
			result.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));

			that.setState({
				Navs: result

			})
		}, function (error) {
			that.setState({
				loading: 0
			})
			that.getCategory();
			console.log(error)
		})


	}
	getProducts() {
		axios.post(this.state.url + 'getProducts', {
			type: 2
		})
			.then(response => {
				var img = this.state.absuluteUrl + response.data.result[0].fileUploaded.split("public")[1];
				this.setState({
					Obj: response.data.result[0],
					img: img,
					money: response.data.money
				})


			})
			.catch(error => {
				console.log(error)
			})

	}
	persianNumber(input) {
		var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
		var string = (input + '').split('');
		var count = string.length;
		var num;
		for (var i = 0; i <= count; i++) {
			num = string[i];
			if (persian[num]) {
				string[i] = persian[num];
			}
		}
		return string.join('');
	}
	getCategory() {
		axios.post(this.state.url + 'GetCategory', { condition: {} })
			.then(response => {
				let resp = [];

				let forRem = []
				response.data.result.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
				for (let i = 0; i < response.data.result.length; i++) {
					let children = [];
					response.data.result.map(function (item, index) {
						if (response.data.result[i]._id == item.Parent && !item.Deactivate) {
							children.push(item);
							if (forRem.indexOf(item._id) == -1)
								forRem.push(item._id)
							//response.data.result.splice(i,1)
						}
						if (forRem.indexOf(item._id) == -1 && item.Deactive) {
							forRem.push(item._id)
						}

					})

					//if(children.length > 0)
					response.data.result[i].children = children
				}
				for (let j = 0; j < forRem.length; j++) {
					for (let i = 0; i < response.data.result.length; i++) {

						if (response.data.result[i]._id == forRem[j])
							response.data.result.splice(i, 1)
					}

				}
				/*for(let i=0;i<6;i++){
				 response.data.result.map(function(item,index){
					 if(response.data.result[index].children)
						 response.data.result[index].children.map(function(item1,index1){
						 	
						 })
				 })
				}*/

				this.setState({
					Cat: response.data.result
				})


				// this.getProducts();



			})
			.catch(error => {
				console.log(error)
			})

	}
	GoToProduct(event) {
		this.setState({
			id: event.currentTarget.id
		})
	}
	makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	render() {
		const { activeKey } = this.state;
		const { expanded } = this.state;
		if (this.state.id) {
			return <Redirect to={"/products?id=" + this.state.id} push={true} />;
		}
		return (

			this.state.Theme != null ?
				<div className="firstInPage" style={{ position: "relative", webkitBoxShadow: "rgb(0 0 0 / 4%) 0 7px 8px 0", boxShadow: "0 7px 8px 0 rgb(0 0 0 / 4%)", marginBottom: 5 }} >

					{this.state.loading == 1 &&
						<div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
							<Loader content="لطفا صبر کنید ..." className="iranyekanweblight" />
						</div>
					}
					<div>
						<div style={{ backgroundColor: '#fff' }}  >
							<div style={{ width: 250 }}>
								<Sidebar visible={this.state.OpenSideBar} position="right" onHide={() => this.setState({ OpenSideBar: false })} style={{ padding: 0, maxheight: 200, overflowY: 'auto' }}>
									<Sidenav
										activeKey={this.state.activeKey}
										onSelect={this.handleSelect}
										style={{ position: 'absolute', zIndex: 2, marginTop: 25 }}
										appearance="subtle"
									>
										<Sidenav.Header>
											<div style={headerStyles} className="iranyekanweblight" >دسته بندی کالاها</div>
										</Sidenav.Header>
										<Sidenav.Body>
											<Nav >
												{this.state.Cat.map((item, index) => {
													return (
														item.children.length == 0 ?
															<Nav.Item eventKey="1" title={item.name} style={{ textAlign: 'right' }} >
																<Link to={"/category?id=" + item._id} style={{ textDecoration: 'none', textAlign: 'right' }} className="iranyekanweblight">{item.name}</Link>
															</Nav.Item>
															:
															<Dropdown icon={<Link to={"/category?getSubs=1&&id=" + item._id} style={{ textDecoration: 'none', textAlign: 'right', float: 'left' }} className="iranyekanweblight" ><Icon icon="page-top" style={{ fontSize: 17, color: '#333' }} /></Link>} eventKey={index + "-" + 1} title={item.name} className="iranyekanweblight" style={{ textAlign: 'right' }}>
																{
																	item.children.map((itemC, indexC) => {
																		let C = indexC + 1;
																		let EventKey = indexC + "-" + 1;

																		return (
																			itemC.children.length == 0 ?
																				<Dropdown.Item eventKey={EventKey}>
																					<Link to={"/category?id=" + itemC._id} style={{ textDecoration: 'none', textAlign: 'right' }} className="iranyekanweblight">{itemC.name}</Link>
																				</Dropdown.Item>
																				:
																				<Dropdown.Menu icon={<Link to={"/category?getSubs=1&&id=" + itemC._id} style={{ textDecoration: 'none', textAlign: 'right', float: 'left' }} className="iranyekanweblight" ><Icon icon="page-top" style={{ fontSize: 17, color: '#333' }} /></Link>} title={itemC.name} eventKey={EventKey + "-" + 1} >
																					{itemC.children.map((itemD, indexD) => {
																						let D = indexD + 1;
																						let EventKey = indexD + "-" + 1;
																						return (
																							itemD.children.length == 0 ?
																								<Dropdown.Item eventKey={EventKey}>
																									<Link to={"/category?id=" + itemD._id} style={{ textDecoration: 'none', textAlign: 'right' }} className="iranyekanweblight">{itemD.name}</Link>
																								</Dropdown.Item>
																								:
																								<Dropdown.Menu icon={<Link to={"/category?getSubs=1&&id=" + itemD._id} style={{ textDecoration: 'none', textAlign: 'right', float: 'left' }} className="iranyekanweblight" ><Icon icon="page-top" style={{ fontSize: 17, color: '#333' }} /></Link>} title={itemD.name} eventKey={EventKey + "-" + 1} >
																									{itemD.children.map((itemE, indexE) => {
																										let D = itemE + 1;
																										let EventKey = itemE + "-" + 1;
																										return (
																											itemE.children.length == 0 ?
																												<Dropdown.Item eventKey={EventKey}>
																													<Link to={"/category?id=" + itemE._id} style={{ textDecoration: 'none', textAlign: 'right' }} className="iranyekanweblight">{itemE.name}</Link>
																												</Dropdown.Item>
																												:
																												<Dropdown.Menu icon={<Link to={"/category?getSubs=1&&id=" + itemE._id} style={{ textDecoration: 'none', textAlign: 'right', float: 'left' }} className="iranyekanweblight" ><Icon icon="page-top" style={{ fontSize: 17, color: '#333' }} /></Link>} title={itemE.name} eventKey={EventKey + "-" + 1} >
																													{itemE.children.map((itemF, indexF) => {
																														let D = itemF + 1;
																														let EventKey = itemF + "-" + 1;
																														return (

																															<Dropdown.Item eventKey={EventKey}>
																																<Link to={"/category?id=" + itemF._id} style={{ textDecoration: 'none', textAlign: 'right' }} className="iranyekanweblight">{itemF.name}</Link>
																															</Dropdown.Item>
																														)
																													})
																													}
																												</Dropdown.Menu>
																										)
																									})
																									}
																								</Dropdown.Menu>

																						)
																					})
																					}
																				</Dropdown.Menu>
																		)
																	})
																}
															</Dropdown>



													)
												})
												}


											</Nav>
										</Sidenav.Body>
									</Sidenav>
								</Sidebar>

							</div>

							<div className="nav-wrapper mr-2 mr-lg-5" style={{ background: '#fff' }}>
								<Navbar activeKey={activeKey} className={this.state.Theme == "2" ? "B-container" : "A-container"} >

									<Navbar.Body>
										<Nav onSelect={this.handleSelect} activeKey={activeKey} pullRight>
											<Dropdown title="About" style={{ display: 'none' }}>
												<Dropdown.Item eventKey="4">Company</Dropdown.Item>
												<Dropdown.Item eventKey="5">Team</Dropdown.Item>
												<Dropdown.Item eventKey="6">Contact</Dropdown.Item>
											</Dropdown>

											<Nav.Item eventKey="1" className="YekanBakhFaBold" onClick={() => this.setState({ OpenSideBar: true })} >

												<span style={{ paddingRight: 5 }} className="fa fa-bars"></span><span style={{ paddingRight: 5 }}>دسته بندی کالاها</span>

											</Nav.Item>

											{this.state.Navs.map((item, index) => {
												if (item.link && item.link.indexOf("http") > -1) {
													return (
														<Nav.Item eventKey="2" className="YekanBakhFaBold">
															<a href={item.link} style={{ textDecoration: 'none' }}>
																{item.title}
															</a></Nav.Item>
													)
												} else {
													return (
														<Nav.Item eventKey="2" className="YekanBakhFaBold">
															<Link to={`${process.env.PUBLIC_URL}` + item.link} style={{ textDecoration: 'none' }}>
																{item.title}
															</Link></Nav.Item>
													)
												}

											})
											}
										</Nav>

									</Navbar.Body>
								</Navbar>

							</div>

						</div>
					</div>
				</div>
				:
				<div>
				</div>
		)
	}
}
const panelStyles = {
	padding: '15px 20px',
	color: '#aaa'
};

const headerStyles = {
	padding: 20,
	fontSize: 16,
	background: 'rgb(78 185 34)',
	color: ' #fff',
	textAlign: 'right'
};
const mapStateToProps = (state) => {
	return {
		CartNumber: state.CartNumber,
		off: state.off,
		credit: state.credit
	}
}
export default withRouter(
	connect(mapStateToProps)(Header2)
);