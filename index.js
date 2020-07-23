const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();


app.use(express.static("public"));
app.set("views", "./views");
app.listen(9080);

var obj ={};

function crawlData(){
    app.get("/", function (req, res) {
        request("http://qldt.ptit.edu.vn/default.aspx?page=thoikhoabieu&sta=1&id=B19DCCN719", function (error, response, body) {
            if (error) {
                console.log(error);
                res.status(302).send({ error: "Couldnt connect to qldt because url not found" })

            }
            else {
                $ = cheerio.load(body);
                var maSV = $(body).find("span#ctl00_ContentPlaceHolder1_ctl00_lblContentMaSV");
                var nameAndBirthday = $(body).find("span#ctl00_ContentPlaceHolder1_ctl00_lblContentTenSV");
                var classAndBrand = $(body).find("span#ctl00_ContentPlaceHolder1_ctl00_lblContentLopSV");

                
                obj.masinhvien = maSV.text();
                obj.hoten = nameAndBirthday.text();
                obj.lop = classAndBrand.text();
                
                let stringBirthday = "";
                let checkBirthday;
                for(let count =0; count < obj.hoten.length; count++){
                    if (obj.hoten[count] === ":"){
                        checkBirthday = count;
                    }
                }

                for(let count = checkBirthday+1; count <obj.hoten.length;count++){
                    stringBirthday += obj.hoten[count];
                }

                checkBirthday = obj.hoten.indexOf("-");

                obj.hoten = obj.hoten.slice(0, checkBirthday - 1);

                let checkBrand = obj.lop.indexOf("-");

                let checkFaculty;

                for(let count =0; count < obj.lop.length; count++ ){
                    if (obj.lop[count] === "-"){
                        checkFaculty = count;
                    }
                }

                obj.nganhHoc = obj.lop.slice(checkBrand + 12, checkFaculty - 1);

                obj.khoa = obj.lop.slice(checkFaculty+8, obj.lop.length);

                obj.lop = obj.lop.slice(0, checkBrand + 2);
                obj.ngaysinh = stringBirthday;
                res.status(200).send(obj);     
                

            }

        });


    });
    

    //return obj;
}   
crawlData();      


