import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const axios =require('axios');

class Home extends React.Component{
    constructor(){
        super();

        this.state={
            data1:[],
            editData:[],
            editid:'',
            firstname:'',
            lastname:'',
            email:'',
            state:'',
            city:'',
            isEditing:false,
            state1:[],
            city1:[],
            currentPage: 1,
            PerPage:2


        };
        this.list();
        axios.get('http://localhost:8282/statelist').then((success)=>{
            if(!success)
            {
                console.log(`Data Not found`);
            }
            this.setState({state1:success.data});
            console.log(`Data :`, this.state.data1);
        }).catch((e)=>{
            console.log(`Error : `,e.message);
        });


    }
    list=()=>{
        axios.get('http://localhost:8282/list').then((success)=>{
            if(!success)
            {
                console.log(`Data Not found`);
            }
            this.setState({data1:success.data});
            console.log(`Data :`, this.state.data1);
        }).catch((e)=>{
            console.log(`Error : `,e.message);
        })
    }

    sendData=()=>{
        console.log("Employee data",this.state);
        axios.post(
            'http://localhost:8282/add',
            {
                firstname:this.state.firstname,
                lastname:this.state.lastname,
                email:this.state.email,
                state:this.state.state,
                city:this.state.city

            }).then((res)=>{
            console.log(`Response`,res.data);
            //this.props.history.push('/list');
        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });
    }
    updateData=()=>{
        console.log("Employee data",this.state);
        axios.post(
            'http://localhost:8282/update',
            {
                id:this.state.editid,
                firstname:this.state.firstname,
                lastname:this.state.lastname,
                email:this.state.email,
                state:this.state.state,
                city:this.state.city

            }).then((res)=>{
            this.setState({
                isEditing: false
            })
            console.log(`Response`,res.data);
            this.list();
            //this.props.history.push('/list');
        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });

    }
    deleteData=(eid)=>{
        //alert('Delete');
        //console.log("emp data",eid);
        axios.post(
            'http://localhost:8282/delete',
            {
                id:eid
            }).then((res)=>{
            console.log(`Response ${res.data}`);
            this.list();

        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });
    }
    fillCity=(event)=>{
        alert(event.target.value);
        axios.post(
            'http://localhost:8282/findbystate',
            {
                statename:event.target.value
            }).then((success)=>{
           // console.log(`City ${success.data[0].statename}`);

            this.setState({city1:success.data});
            console.log(`City `,this.state.city1);
           // this.sendData();

        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });

    }
    sort=()=>{
        axios.get('http://localhost:8282/sort').then((success)=>{
            if(!success)
            {
                console.log(`Data Not found`);
            }
            this.setState({data1:success.data});
            console.log(`Data :`, this.state.data1);
        }).catch((e)=>{
            console.log(`Error : `,e.message);
        });
    }
    dsort=()=>{
        axios.get('http://localhost:8282/dsort').then((success)=>{
            if(!success)
            {
                console.log(`Data Not found`);
            }
            this.setState({data1:success.data});
            console.log(`Data :`, this.state.data1);
        }).catch((e)=>{
            console.log(`Error : `,e.message);
        });
    }
    mypage=(no)=>{
        axios.post(
            'http://localhost:8282/mypage',
            {
                no:no
            }).then((res)=>{
           // console.log(`Response ${res.data}`);
            this.setState({data1:res.data})
            //this.list();

        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });
    }
    handleChange=(event)=>{

        console.log('fullname : ',event.target.value);
        const {value, name} = event.target;
        const editData = this.state.editData;
        editData[name] = value;
        this.setState({editData}, () => {
            console.log(this.state.editData1);
        });

    }
    handleCity=(event)=>{

        console.log('city : ',event.target.value);


    }
    render(){
        const isEditing =this.state.isEditing;
        const editData1=this.state.editData;


        return(

            <section className="main">
                <center>


                <div className="myForm">
                    <h1>Employee Management System</h1>
                    <form>
                        <table className="myformtable" border="1">
                            <tr>
                                <td><label>Firstname</label></td>
                                <td><input type="text" value={editData1.firstname} onChange={this.handleChange} name="firstname" id="txtfname" required={true}/>*</td>
                            </tr>
                            <tr>
                                <td><label>Lastname</label></td>
                                <td><input type="text" value={editData1.lastname} onChange={this.handleChange}  name="lastname" id="txtlname" required={true}/>*</td>
                            </tr>
                            <tr>
                                <td><label>Email</label></td>
                                <td><input type="email" value={editData1.email}  onChange={this.handleChange} name="email" id="txtemail" required={true}/>*</td>
                            </tr>
                            <tr>
                                <td><label>State</label></td>
                                <td>
                                    <select name="state" id="selState" value={editData1.state} onChange={this.fillCity}>
                                        {
                                            this.state.state1.map((st,i)=>{
                                                return <option value={st.statename}>{st.statename}</option>
                                            })
                                        }
                                    </select>*
                                </td>

                            </tr>
                            <tr>
                                <td><label>City</label></td>
                                <td>
                                    <select name="city" id="selCity" value={editData1.city} onChange={this.handleChange} >
                                        {
                                            this.state.city1.map((st,i)=>{
                                                return <option value={st.cityname}>{st.cityname}</option>
                                            })
                                        }
                                    </select>*

                                  </td>
                            </tr>
                            <tr>
                                {
                                    isEditing?

                                    <td><input className="btnS" type="submit" name="btns" value="Update" onClick={()=>{
                                        this.setState({
                                            firstname:document.getElementById('txtfname').value,
                                            lastname:document.getElementById('txtlname').value,
                                            email:document.getElementById('txtemail').value,
                                            state:document.getElementById('selState').value,
                                            city:document.getElementById('selCity').value,
                                        },()=>{
                                            console.log('Call back')
                                            this.updateData();
                                        })
                                    }}/></td>
                                    :

                                    <td><input className="btnU" type="submit" name="btns" value="Insert" onClick={()=>{
                                    this.setState({
                                        firstname:document.getElementById('txtfname').value,
                                        lastname:document.getElementById('txtlname').value,
                                        email:document.getElementById('txtemail').value,
                                        state:document.getElementById('selState').value,
                                        city:document.getElementById('selCity').value,
                                    },()=>{
                                        console.log('Call back')
                                        this.sendData();
                                    })

                                }}/></td>
                                }

                            </tr>
                        </table>


                    </form>
                </div>
                <div className="myTable" >

                    <table border="1" className="mytable">
                        <tr className="myrow">
                            <td>Fistname</td>
                            <td>Lastname</td>
                            <td>Email</td>
                            <td>State</td>
                            <td>city</td>
                            <td>Action</td>
                        </tr>
                        {
                            this.state.data1.map((s,index)=>{
                                return <tr>
                                    <td>{s.firstname}</td>
                                    <td>{s.lastname}</td>
                                    <td>{s.email}</td>
                                    <td>{s.state}</td>
                                    <td>{s.city}</td>

                                    <td className="action">
                                      <a onClick={()=>{
                                          console.log("id : ",s._id);
                                          this.deleteData(s._id);
                                      }}>Delete</a>||
                                        <a onClick={()=>{
                                            console.log("id : ",s._id);

                                            this.setState({
                                                editid:s._id,
                                                isEditing:true,
                                                editData:s
                                            })
                                        }}>Edit</a>
                                    </td>
                                </tr>

                               })
                        }
                    </table>
                    {/*<div className="mypage">*/}
                        {/*<a onClick={this.mypage(1)}>1</a>*/}
                        {/*<a onClick={this.mypage(2)}>2</a>*/}
                    {/*</div>*/}

                    <div className="mylinks">
                        <div className="sort1">
                            <a onClick={()=>{
                                this.sort();
                            }}>Sort by Ascending</a>
                        </div>
                        <div className="sort2">
                            <a onClick={()=>{
                                this.dsort();
                            }}>Sort by Descending</a>
                        </div>
                    </div>


                </div>
                </center>
            </section>
        )
    }
}

ReactDOM.render(<Home />, document.getElementById('root'));

