import React from 'react';
import ReactDOM from 'react-dom';
import {} from 'react-bootstrap'
import {Table,Input,Pagination, PaginationItem, PaginationLink} from 'reactstrap'
import Modal from 'react-modal';
import './index.css';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { confirmAlert } from 'react-confirm-alert';
const axios =require('axios');
let len=0,totalPages=0;
class Home extends React.Component{
    constructor(){
        super();
        this.state={
            temp:[],
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
            isActive:false,
            currentPage:'',
            currentData:[],
            totalRecords:5,
            curr:1,
            isSearchFinish:true,
            //Search
            isSearch:false,
            searchData:[]
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
    clearData=()=>{
        this.state.editData=[];
        this.state.currentData=[];
        console.log('Edit Data : '.this.state.editData)
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



        }).catch((e)=>{
            console.log(`Error : `,e.message);
        })
    }
    submit = (sid) => {
        confirmAlert({
            title: 'Confirm to submit',                        // Title dialog
            message: 'Are you sure to do this.',               // Message dialog
            childrenElement: () => <div>Confirm Box</div>,       // Custom UI or Component
            confirmLabel: 'Confirm',                           // Text button confirm
            cancelLabel: 'Cancel',                             // Text button cancel
            onConfirm: () => {
                //  alert('a');
                this.deleteData(sid);
            },
            onCancel: () => {//alert('b')
            }
        })
    };
    sendData=(e)=>{
        console.log(this.state.isActive);
        e.preventDefault();
        console.log("Employee data",this.state.currentData);
        axios.post(
            'http://localhost:8282/add',
            {
                ...this.state.editData

            }).then((res)=>{

            this.state.data1.push(res.data);
            this.setState({data1:this.state.data1});
            console.log(`new data `,this.state.data1);

            this.toggleActive();
            this.setState({
                data1:this.state.data1.reverse(),
            });
            //this.clearData();

            //this.props.history.push('/list');
        }).catch((e)=>{
            console.log(`Error : ${e.message}`);
        });
    }
    updateData=(e)=>{
        e.preventDefault();
        this.toggleActive();
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
                data1:this.state.data1,
                isEditing: false,
            })
            this.clearData();
            this.toggleActive();
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

            var dt=this.state.data1.filter((d)=>res.data['_id']!==d._id);

            this.setState({data1:dt})

            //this.list();

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


        var key=e.target.id;
        console.log(key);
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a[key] > b[key]);

        this.setState({
            data1:myData
        })
        console.log('sorted : ',this.state.data1);

    }
    dsort=(e)=>{
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
        var key=e.target.id;
        console.log(key);
        var myData = [].concat(this.state.data1)
            .sort((a, b) => a[key] > b[key]);

        this.setState({
            data1:myData.reverse()
        })
        console.log('sorted : ',this.state.data1);

    }
    mypage=(no)=>{

        // axios.post(
        //     'http://localhost:8282/mypage',
        //     {
        //         no:no,
        //         records:this.state.totalRecords
        //     }).then((res)=>{
        //    // console.log(`Response ${res.data}`);
        //     this.setState({data1:res.data})
        //     //this.list();
        //
        // }).catch((e)=>{
        //     console.log(`Error : ${e.message}`);
        // });
        this.setState({
            curr:no
        })
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
    handleEntry=(e)=>{
       // alert(e.target.value);
        this.setState({
            totalRecords:e.target.value
        })
       // alert(this.state.totalRecords);
    }
    handleSearch=(e)=>{
        e.preventDefault();
        console.log("msg",e.target.value)
        this.setState({
            //data1:this.state.searchData
            isSearch:true,
            searchData:[],
           // temp:[]

        });
        //let key=document.getElementById('txtfirstname').value;
        let key=e.target.value;
        let {searchData} = this.state;
        searchData=[];
        this.state.data1.map((values,i)=>{
           // console.log('asdasd',values.firstname);
            if(values.firstname.includes(e.target.value))
            {
                searchData.push(values);
            }
            else if(values.lastname.includes(e.target.value))
            {
                searchData.push(values);
            }
            if(e.target.value==="")
            {
             //   alert();
                this.setState({
                    isSearch:false
                })
            }
            // if(emp.firstname===key||emp.lastname===key||emp.email===key||emp.city===key||emp.state===key)
            // {
            //     this.state.searchData.push(emp);
            //
            //     this.setState({
            //         //data1:this.state.searchData
            //         isSearch:true
            //
            //     });
            // }
        });

        this.setState({searchData},()=>{
            console.log("searchArray",searchData);
        });
    }
    toggleActive=()=>{

        this.setState({
            isActive:!this.state.isActive,
            isEditing:false
        })
        this.state.editData=[]
    }


    render(){
        var pages=[]
        const isEditing =this.state.isEditing;
        //const isSearch =this.state.isSearch;
        const isSearchFinish =this.state.isSearchFinish;


        const editData1=this.state.editData;
        const searchData=this.state.searchData;


        var lastrec=this.state.curr*this.state.totalRecords;
        var firstrec=lastrec-this.state.totalRecords;
        var totrec=this.state.data1.slice(firstrec,lastrec);


        len=this.state.data1.length;
        totalPages=Math.ceil(len/this.state.totalRecords);
        console.log('Total Pages = ',totalPages);

        for(let i=1;i<=totalPages;i++)
        {
            pages.push(i);
        }



        return(
            <div className="">
                <br/><br/>
                <div className=" col-lg-12">
                    <Modal isOpen={this.state.isActive} onRequestClose={this.toggleActive} ariaHideApp={false} style={{

                        Overlay: {
                           // height: '50%',
                            position: 'fixed',
                            top: '25px',
                            left: '50%',
                            right: '100px',
                            bottom: '20px',
                            background: 'white'
                        },
                        content: {
                            height:'80%',
                            width:'70%',
                            top: '20%',
                            marginLeft:'30px',
                            bottom: '30%',
                            border: 'solid brown',
                            background: 'white',
                            overflow: 'auto',
                            borderRadius: '4px',
                            outline: 'none',

                        }
                    }} >

                        <div id="myform" className="col-lg-6">

                        <form onSubmit={this.sendData}>
                            <div className="form-group row" >

                                <p className=" col-sm-10 text-primary">Employee Management System</p>
                                <div className="col-sm-2">
                                    <i className="fa fa-close" onClick={this.toggleActive}></i>
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname">Firstname<span>*</span></label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="text" value={editData1.firstname} onChange={this.handleChange} name="firstname" id="txtfname" required={true}/>
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname">Lastname<span>*</span></label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="text" value={editData1.lastname} onChange={this.handleChange}  name="lastname" id="txtlname" required={true}/>
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname">Email<span>*</span></label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="email" value={editData1.email}  onChange={this.handleChange} name="email" id="txtemail" required={true}/>
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname">State<span>*</span></label>
                                <div className="col-sm-10">
                                    <select className="form-control" name="state" id="selState" value={editData1.state} onChange={this.handleChange}>
                                        <option>--Select State--</option>
                                        {
                                            this.state.state1.map((st,i)=>{
                                                return <option value={st.statename}>{st.statename}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname">City<span>*</span></label>
                                <div className="col-sm-10">
                                    <select className="form-control" name="city" id="selCity" onChange={this.handleChange} >


                                        <option value={editData1.city}>{editData1.city}</option>

                                        {
                                            this.state.city1.map((c,i)=>{
                                                if(c.statename === editData1.state) {
                                                    return <option value={c.cityname}>{c.cityname}</option>
                                                }

                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row" >
                                <label className="col-sm-2 col-form-label" for="txtname"></label>

                                <div className="col-sm-10">
                                    {
                                        isEditing?

                                            <button className="btn btn-secondary"  name="btns" value="Update" onClick={this.updateData}>Update</button>
                                            :

                                           <button className="btn btn-warning" type="submit" name="btns" value="Insert" >Insert</button>
                                    }
                                </div>
                            </div>

                        </form>
                        </div>
                    </Modal>
                </div>
                <div id="divShow" className="">
                    <div className="row">
                             <div className="col-lg-1 offset-2 ">
                            <div className="form-group">
                                <select id="selEntry" onChange={this.handleEntry} className="form-control">
                                <option value="5">5</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                </select>
                            </div>
                        </div>

                            <div id="divsearch" className="col-lg-6">

                                <div className=" input-group">
                                    <input placeholder="Firstname here" onChange={
                                        (e)=>{this.handleSearch(e)
                                    }} type="text" name="firstname" id="txtfirstname" className="form-control" />
                                    {/*<button  className=" btn btn-primary "><i className="fa fa-search" onClick={this.handleSearch} > </i></button>*/}
                                </div>

                            </div>

                            <div className="col-lg-1">
                                <button className=" btn btn-primary " onClick={this.toggleActive}>+</button>
                            </div>
                    </div>
                    <div className="col-lg-12"> <h3>{}</h3></div>
                    <div className="col-lg-8 offset-2 table-responsive">
                        <table  className="table table-hover ">
                            <tr className="myrow">
                                <td>Firstname
                                    <a id="firstname" onClick={this.sort} className="fa fa-chevron-up"></a>
                                    <a id="firstname" onClick={this.dsort} className="fa fa-chevron-down"></a>
                                </td>
                                <td>Lastname
                                    <a id="lasttname" onClick={this.sort} className="fa fa-chevron-up"></a>
                                    <a id="lasttname" onClick={this.dsort} className="fa fa-chevron-down"></a></td>
                                <td>Email
                                    <a id="email" onClick={this.sort} className="fa fa-chevron-up"></a>
                                    <a id="email" onClick={this.dsort} className="fa fa-chevron-down"></a></td>
                                <td>State
                                    <a id="state" onClick={this.sort} className="fa fa-chevron-up"></a>
                                    <a id="state" onClick={this.dsort} className="fa fa-chevron-down"></a></td>
                                <td>city
                                    <a id="city" onClick={this.sort} className="fa fa-chevron-up"></a>
                                    <a id="city" onClick={this.dsort} className="fa fa-chevron-down"></a>
                                </td>
                                <td>Action 1</td>
                                <td>Action 2</td>

                            </tr>
                            {
                                (this.state.isSearch)?
                                    this.state.searchData.map((s,index)=>{
                                        return <tr>
                                            <td>{s.firstname}</td>
                                            <td>{s.lastname}</td>
                                            <td>{s.email}</td>
                                            <td>{s.state}</td>
                                            <td>{s.city}</td>

                                            <td className="action">
                                                <button className="btn btn-outline-danger" onClick={()=>{
                                                    console.log("id : ",s._id);
                                                    this.submit(s._id);
                                                }}>Delete</button>
                                            </td>
                                            <td className="action">

                                                <button  className="btn btn-outline-primary" onClick={()=>{
                                                    console.log("id : ",s._id);
                                                    this.setState({
                                                        editid:s._id,
                                                        isEditing:true,
                                                        editData:s,
                                                        isActive:true
                                                    })

                                                    // this.updateData();
                                                }}>Edit</button>
                                            </td>

                                        </tr>

                                    })
                                    :
                                    totrec.map((s,index)=>{
                                        if(index<this.state.totalRecords)
                                        {
                                            return <tr>
                                                <td>{s.firstname}</td>
                                                <td>{s.lastname}</td>
                                                <td>{s.email}</td>
                                                <td>{s.state}</td>
                                                <td>{s.city}</td>

                                                <td className="action">
                                                    <button className="btn btn-outline-danger" onClick={()=>{
                                                        console.log("id : ",s._id);
                                                        this.submit(s._id);
                                                    }}>Delete</button>
                                                </td>
                                                <td className="action">

                                                    <button className="btn btn-outline-primary" onClick={()=>{
                                                        console.log("id : ",s._id);

                                                        this.setState({
                                                            editid:s._id,
                                                            isEditing:true,
                                                            editData:s,
                                                            isActive:true
                                                        })
                                                        // this.updateData();
                                                    }}>Edit</button>
                                                </td>
                                            </tr>
                                        }


                                    })

                            }
                        </table>
                    </div>
                    <div className="col-lg-12 offset-5" >

                            {
                            <div>
                                <Pagination>

                                    {pages.map((p, i) => {
                                        return <li className="active" onClick={() => {
                                            this.mypage(p);
                                        }}><PaginationItem><PaginationLink href="#">{p}</PaginationLink></PaginationItem></li>
                                    })
                                    }

                                </Pagination>
                                <p>Shows {this.state.totalRecords} records from {len} Entries </p>
                            </div>

                            }

                    </div>
                    {/*<div className="col-lg-12" >*/}
                        {/*<div className="mylinks">*/}
                            {/*<div className="sort1">*/}
                                {/*<a onClick={()=>{*/}
                                    {/*this.sort();*/}
                                {/*}}>Sort by Ascending</a>*/}
                            {/*</div>*/}
                            {/*<div className="sort2">*/}
                                {/*<a onClick={()=>{*/}
                                    {/*this.dsort();*/}
                                {/*}}>Sort by Descending</a>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}



                </div>

            </div>
        )
    }
}

ReactDOM.render(<Home />, document.getElementById('root'));

