import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FollowupsComponent } from '../followups/followups.component';
import { DeletedFollowupsComponent } from '../deleted-followups/deleted-followups.component';

@Component({
  selector: 'app-index-followups',
  standalone: true,
  imports: [MaterialModule, FollowupsComponent, DeletedFollowupsComponent],
  templateUrl: './index-followups.component.html',
  styleUrl: './index-followups.component.sass'
})
export class IndexFollowupsComponent {

    constructor() { }

    ngOnInit(): void {
    }

}
