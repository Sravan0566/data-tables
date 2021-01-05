import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import * as moment from 'moment/moment';
declare var $: any;
import 'datatables.net';
@Component({
    templateUrl: 'audit.component.html',
})
export class AuditComponent implements OnInit {
    audits = [];
    currentUser = {};
    format = '12';
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllAudits('');
    }
    changedata(val) {
        this.audits = [];
        if (val === '24') {
            this.loadAllAudits('24');
        } else {
            this.loadAllAudits('');
        }
    }

    loadAllAudits(val) {
        $("#example").DataTable().destroy();
        this.auditService.getAll().pipe(first())
            .subscribe(audits => {
                this.audits = audits;
                this.audits.forEach(element => {
                    element['login'] = this.convertTime(+element['loginTime'], val)
                    element['logout'] = this.convertTime(+element['logoutTime'], val)
                });
                setTimeout(() => {
                    $(document).ready(function () {
                        $('#example').dataTable({
                            "paging": true,
                            "ordering": true,
                            "info": true,
                            "searching": true,
                            "lengthMenu": [[10, 20, 50, 75, -1], [10, 20, 50, 75, "All"]],
                        });
                    });
                }, 1500);


            },
                error => {
                });
    }
    convertTime(currentDate, val) {
        if (val === '') {
            return moment(currentDate).format('DD/MM/YYYY hh:mm:ss a');
        } else {
            return moment(currentDate).format('DD/MM/YYYY HH:MM:SS a');
        }
    }
}