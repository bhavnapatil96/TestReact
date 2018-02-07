import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const axios =require('axios');
let len=0,totalPages=0;
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
            pages:[],
            currentPage:'',
            currentData:[],
            searchData:[],
            totalRecords:5,
            curr:1
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
        axios.get('http://localhost:8282/citylist').then((success)=>{
            if(!success)
            {
                console.log(`Data Not found`);
            }
            this.setState({city1:success.data});
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
            console.log('Total Records = ',this.state.data1.length);

            len=this.state.data1.length;
            totalPages=Math.ceil(len/this.state.totalRecords);
            console.log('Total Pages = ',totalPages);

            for(let i=1;i<=totalPages;i++)
            {
                this.state.pages.push(i);
            }

        }).catch((e)=>{
            console.log(`Error : `,e.message);
        })
    }

    sendData=(e)=>{
        alert();
        e.preventDefault();
        console.log("Employee data",this.state.currentData);
        axios.post(
            'http://localhost:8282/add',
            {
                firstname:this.state.currentData.firstname,
                lastname:this.state.currentData.lastname,
                email:this.state.currentData.email,
                state:this.state.currentData.state,
                city:this.state.currentData.city

            }).then((res)=>{
            console.log(`Response`,res.data);

            this.state.data1.push(res.data);
            this.setState({data1:this.state.data1});
            console.log(`new data `,this.state.data1);

            this.setState({
                editData:'',
                currentData:''
            })
            //this.props.history.push('/list');
        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });
    }
    updateData=(e)=>{
        e.preventDefault();
        console.log("Employee data",this.state);
        axios.post(
            'http://localhost:8282/update',
            {
                id:this.state.editid,
                firstname:this.state.editData.firstname,
                lastname:this.state.editData.lastname,
                email:this.state.editData.email,
                state:this.state.editData.state,
                city:this.state.editData.city

            }).then((res)=>{
            this.setState({
                isEditing: false
            })
            console.log(`Response`,res.data);

            //this.state.data1.push(res.data);
            this.setState({data1:this.state.data1})
            console.log(`new data `,this.state.data1);
            //this.list();
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
            this.state.data1.pop(res.data);
            this.setState({data1:this.state.data1})
            // this.setState({
            //     data1:res.data
            // })
            //this.list();

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
    sort=(e)=>{
        // axios.get('http://localhost:8282/sort').then((success)=>{
        //     if(!success)
        //     {
        //         console.log(`Data Not found`);
        //     }
        //     this.setState({data1:success.data});
        //     console.log(`Data :`, this.state.data1);
        // }).catch((e)=>{
        //     console.log(`Error : `,e.message);
        // });


        var key=e.target.value;
        console.log(key);
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a.key > b.key);

        this.setState({
            data1:myData
        })
        console.log('sorted : ',this.state.data1);

    }
    dsort=()=>{
        // axios.get('http://localhost:8282/dsort').then((success)=>{
        //     if(!success)
        //     {
        //         console.log(`Data Not found`);
        //     }
        //     this.setState({data1:success.data});
        //     console.log(`Data :`, this.state.data1);
        // }).catch((e)=>{
        //     console.log(`Error : `,e.message);
        // });
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a.firstname > b.firstname);

        this.setState({
            data1:myData.reverse()
        })
        console.log('sorted : ',this.state.data1);

    }
    mypage=(no)=>{
        alert(no);
        axios.post(
            'http://localhost:8282/mypage',
            {
                no:no,
                records:this.state.totalRecords
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

        console.log('control : ',event.target.value);
        const currentData=this.state.currentData;
        currentData[name]=value;
        this.setState({currentData}, () => {
            console.log(this.state.currentData.state);
           // console.log(this.state.currentData.city);

        });

    }
    handleCity=(event)=>{

        console.log('city : ',event.target.value);


    }
    handleEntry=(e)=>{
       // alert(e.target.value);
        this.setState({
            totalRecords:e.target.value
        })
        alert(this.state.totalRecords);
    }
    handleSearch=(e)=>{
        let key=document.getElementById('txtfirstname').value;
        alert(key);
    this.state.data1.map((emp,i)=>{
            if(emp.firstname===key||emp.lastname===key||emp.email===key||emp.city===key||emp.state===key)
            {
                this.state.searchData.push(emp);
            }
        })
        this.setState({
            data1:this.state.searchData
        })


    }
    componentDidMount(){

    }
    render(){
        const isEditing =this.state.isEditing;
        const editData1=this.state.editData;
        var lastrec=this.state.curr*5;
        var firstrec=lastrec-4;
        var totrec=this.state.data1.slice(firstrec,lastrec);




        return(

            <section className="main">
                <center>


                <div className="myForm">
                    <h1>Employee Management System</h1>
                    <form>
                        <table className="myformtable" border="1">
                            <tr>
                                <td><label>Firstname</label></td>
                                <td><input type="text" value={editData1.firstname} onChange={this.handleChange} name="firstname" id="txtfname" required={true}/><span>*</span></td>
                            </tr>
                            <tr>
                                <td><label>Lastname</label></td>
                                <td><input type="text" value={editData1.lastname} onChange={this.handleChange}  name="lastname" id="txtlname" required={true}/><span>*</span></td>
                            </tr>
                            <tr>
                                <td><label>Email</label></td>
                                <td><input type="email" value={editData1.email}  onChange={this.handleChange} name="email" id="txtemail" required={true}/><span>*</span></td>
                            </tr>
                            <tr>
                                <td><label>State</label></td>
                                <td>
                                    <select name="state" id="selState" value={editData1.state} onChange={this.handleChange}>
                                       <option>--select--</option>
                                        {
                                            this.state.state1.map((st,i)=>{
                                                return <option value={st.statename}>{st.statename}</option>
                                            })
                                        }
                                    </select><span>*</span>
                                </td>

                            </tr>
                            <tr>
                                <td><label>City</label></td>
                                <td>
                                    <select name="city" id="selCity"   onChange={this.handleChange} >

                                        <option value={editData1.city}>{editData1.city}</option>

                                        {
                                            this.state.city1.map((c,i)=>{
                                                if(c.statename === this.state.currentData.state) {
                                                        return <option value={c.cityname}>{c.cityname}</option>
                                                    }

                                            })
                                        }
                                    </select><span>*</span>

                                  </td>
                            </tr>
                            <tr>
                                {
                                    isEditing?

                                        <td colspan="2"><button className="btnS"  name="btns" value="Update" onClick={this.updateData}>Update</button></td>
                                    :

                                    <td colspan="2"><button className="btnU"  name="btns" value="Insert" onClick={this.sendData}>Insert</button></td>
                                }

                            </tr>
                        </table>


                    </form>
                </div>
                <div className="myTable" >
                    <div>
                        Shows<select id="selEntry" onChange={this.handleEntry}>
                        <option value="5">5</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        </select>
                    </div>
                    <div>
                        Search : <input type="text" name="firstname" id="txtfirstname"/><button onClick={this.handleSearch}>Search</button>
                    </div>
                    <table border="1" className="mytable">
                        <tr className="myrow">
                            <td>Firstname
                                <span value="firstname" onClick={this.sort} className="glyphicon glyphicon-triangle-bottom">*</span>
                                <span value="lastname" onClick={this.dsort} className="glyphicon glyphicon-triangle-top"></span>
                            </td>
                            <td value="lastname" onClick={this.sort}>Lastname</td>
                            <td>Email</td>
                            <td>State</td>
                            <td>city</td>
                            <td>Action 1</td>
                            <td>Action 2</td>

                        </tr>
                        {
                            this.state.data1.map((s,index)=>{
                                if(index<this.state.totalRecords)
                                {
                                    return <tr>
                                        <td>{s.firstname}</td>
                                        <td>{s.lastname}</td>
                                        <td>{s.email}</td>
                                        <td>{s.state}</td>
                                        <td>{s.city}</td>

                                        <td className="action">
                                            <button onClick={()=>{
                                                console.log("id : ",s._id);
                                                this.deleteData(s._id);
                                            }}>Delete</button>
                                        </td>
                                        <td className="action">

                                            <button onClick={()=>{
                                                console.log("id : ",s._id);

                                                this.setState({
                                                    editid:s._id,
                                                    isEditing:true,
                                                    editData:s
                                                })
                                               // this.updateData();
                                            }}>Edit</button>
                                        </td>
                                    </tr>
                                }


                               })
                        }
                    </table>
                    <br/><br/>
                        <div>
                            {
                                this.state.pages.map((p,i)=>{
                                    return <li className="mypage" onClick={()=>{
                                        this.mypage(p);
                                    }}>{p}</li>
                                })
                            }
                        </div>

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

