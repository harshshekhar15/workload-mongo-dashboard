import { Component, OnInit } from "@angular/core";
import { PersonService } from "../../../service/savereaddelete.service";
import { personDetail } from "../../../model/data.model";
import { getResponse, postResponse } from "../../../model/data.model";
import {
  statefulSet,
  jivaReplica,
  jivaController,
  applicationPod,
  overAllStatus,
  link,
  pvc
} from "../../../model/data.model";
import * as $ from "jquery";
import { Subscription, Observable, timer } from "rxjs";
import { error } from "protractor";

@Component({
  selector: "app-workloddetails",
  templateUrl: "./workloddetails.component.html",
  styleUrls: ["./workloddetails.component.scss"]
})
export class WorkloddetailsComponent implements OnInit {
  jivaDetail;
  jivas;
  private windowWidth;
  private rnumber = Math.floor(Math.random() * 10000000);
  public statefullSets: statefulSet[] = [];
  public jivaContrllers: jivaController[] = [];
  public jivaReplicas: jivaReplica[] = [];
  public applicationPods: applicationPod[] = [];
  public overAllStatus: overAllStatus[] = [];
  public postResponses: postResponse;
  public getResponses: getResponse[] = [];
  public personDetails: personDetail[] = [];
  public pvc: pvc[] = [];
  public pvctemp;
  public pvcarray;
  public namespace = "";
  public dockerImage = "";
  public openebsversion = "";
  public overallStatus = "";
  public runningStatus = false;
  public failledStatus = false;
  public unknownStatus = false;
  public chaosTests = [
    "Kill OpenEBS Replica",
    "Increase Latency Between App and Replicas"
  ];
  public selectedChaos = "";
  public selectedApplication = "";
  public writeStatus = false;
  public readStatus = false;
  public alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  public randomString1 = " ";
  public randomString2 = " ";
  public randomnumber: number;
  public getstatus;
  public getmessage;
  public poststatus;
  public postmessage;
  constructor(private personService: PersonService) {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
    // this.personService.getJivaVolumeDetails().subscribe(res => {
    //   this.jivaDetail = res;
    //   this.jivas = this.jivaDetail.data.items;
    //   // console.log(this.jivaDetail.data.items[0]);
    // });

    // console.log("init started.. ");
    for (let j = 0; j < 100; j++) {
      for (let i = 0; i < 10; i++) {
        this.randomString1 =
          this.randomString1 + this.alphabet[Math.floor(Math.random() * 25)];
        this.randomString2 =
          this.randomString2 + this.alphabet[Math.floor(Math.random() * 25)];
      }
      this.randomnumber = Math.floor(Math.random() * 10000000);
      this.personDetails.push({
        rNumber: this.rnumber,
        name: this.randomString1,
        email: this.randomString2,
        age: this.randomnumber
      });
      this.randomString1 = " ";
      this.randomString2 = " ";
    }

    if (this.selectedChaos == "") {
      $(".hide-custom").hide();
    }

    timer(0, 5000).subscribe(x => {
      this.personService.getPodDetails().subscribe(res => {
        console.log(res);
        this.statefullSets = res.statefulSet;
        this.applicationPods = res.applicationPod;
        this.jivaContrllers = res.jivaController;
        this.jivaReplicas = res.jivaReplica;
        this.pvc = res.pvc;
        this.pvctemp = res.pvc;
        this.pvcarray = this.pvctemp.pvc;
        console.log(this.pvcarray);

        // this.jivaReplicas.forEach(function(replica) {
        //   if (replica.status == "Terminating") {
        //     setTimeout(function() {}, 8000);
        //   }
        // });

        // console.log(res.pvc);
        // console.log(res);
        // console.log(this.pvcDetail +'hgvhjgvkhgvkhvkjhvkjh');
        this.dockerImage = this.jivaContrllers[0].openebsjivaversion;
        this.openebsversion =
          "OpenEBS:" + this.jivaContrllers[0].openebsjivaversion.split(":")[1];
        this.namespace = this.jivaContrllers[0].namespace;
        this.overallStatus = res.status;
        if (this.overallStatus == "Running") {
          this.runningStatus = true;
        } else if (
          this.overallStatus == "Pending" ||
          this.overallStatus == "Failed"
        ) {
          this.failledStatus = true;
        } else {
          this.unknownStatus = true;
        }

        error => {
          this.unknownStatus = true;
          console.log(res);
        };
      });
    });
  }

  public listVolume() {
    this.personService.getJivaVolumeDetails().subscribe(res => {
      this.jivaDetail = res;
      this.jivas = this.jivaDetail.data.items;
      // console.log(this.jivaDetail.data.items[0]);
    });
  }

  public save() {
    this.personService
      .save100PersonDetails(this.personDetails)
      .subscribe(res => {
        console.log(res);
        // console.log(res);
        // console.log(res);
        this.postResponses = res;
        // this.postResponses=res.;
        this.poststatus = this.postResponses.status;
        this.postmessage = this.postResponses.message;
        this.writeStatus = true;
      });

    setTimeout(
      function() {
        this.writeStatus = false;
        // console.log(this.writeStatus);
      }.bind(this),
      5000
    );
  }
  public read() {
    this.personService.get100personDetails(this.rnumber).subscribe(res => {
      // console.log(JSON.stringify(res.status));
      // this.getResponses[0].status = res.status;
      this.getResponses[0] = res;
      // this.getResponses.message = res.message;
      this.getstatus = this.getResponses[0].status;
      this.getmessage = this.getResponses[0].message;
      console.log(res.status);
      this.readStatus = true;
    });
    setTimeout(
      function() {
        this.readStatus = false;
        // console.log(this.writeStatus);
      }.bind(this),
      5000
    );
  }

  public onChaosSelect(chaosValue) {
    // console.log(chaosValue);
    this.selectedChaos = chaosValue;
    if (this.selectedChaos != "") {
      $(".hide-custom").show();
    } else {
      $(".hide-custom").hide();
      this.selectedApplication = "";
    }
  }

  public onAppSelect(appValue) {
    this.selectedApplication = appValue;
  }

  public runChaosTest(chaos: string, app: string) {
    // console.log(chaos);
    // console.log(app);
    if (chaos != "" && app != "") {
      // console.log("inside");
      this.personService.runChaosTestService(chaos, app);
    }
  }
}
