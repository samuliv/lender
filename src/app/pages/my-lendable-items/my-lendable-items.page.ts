import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { ExtraService } from 'src/app/services/extra/extra.service';

@Component({
  selector: 'app-my-lendable-items',
  templateUrl: './my-lendable-items.page.html',
  styleUrls: ['./my-lendable-items.page.scss'],
})
export class MyLendableItemsPage implements OnInit {

  myLendableItems: MediaItem[];
  showNoItemsAddedMessage: boolean;
  source: string;

  constructor(
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private wbma: WbmaService,
    private extra: ExtraService,
    private router: Router,
    private eveents: Events,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController) {
      this.source = this.activatedRoute.snapshot.paramMap.get('source');
      this.eveents.subscribe('refresh-my-items', () => {
        this.refreshList();
      });
    }

  ngOnInit() {
    this.showNoItemsAddedMessage = false;
    this.refreshList();
  }

  editItem(item: MediaItem) {
    this.router.navigate(['/add-lendable-item/' + item.file_id + '-' + this.source]);
  }

  async deleteItem(item: MediaItem) {
    const alert = await this.alertController.create({
      header: 'Delete Item',
      subHeader: '',
      message: 'Are you sure you want to delete this lendable item?',
      buttons: [
        {
          text: 'Delete Item',
          handler: () => {
            this.wbma.deleteMedia(item.file_id).subscribe((res) => {
              if (res.message === 'File deleted') {
                const item_id = item.file_id;
                this.myLendableItems.splice(this.myLendableItems.indexOf(item), 1);
                this.extra.itemDeleted(item_id).subscribe((r) => {
                  if ( r.success ) {
                    this.refreshList();
                  }
                });
              }
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async itemClick(item: MediaItem) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Request Operations',
      buttons: [{
        text: 'Edit Item',
        handler: () => {
          this.editItem(item);
        }
      }, {
        text: 'Delete Item',
        role: 'destructive',
        handler: () => {
          this.deleteItem(item);
        }
      }, { text: 'Close'}]
    });

    await actionSheet.present();
  }

  addLendableItem() {
    this.router.navigate(['/add-lendable-item/0-' + this.source]);
  }

  refreshList() {
    this.wbma.getLendableItems().subscribe((res) => {
      if (res.length > 0) {
        // remove other's media
        for (let i=res.length-1; i>-1; i--) {
          if (res[i].user_id !== this.wbma.getMyUserID()) {
            res.splice(i,1);
          }
        }
      }
      res = this.wbma.readMediaData(res);
      this.myLendableItems = res;
    });
  }

  goBack() {
    if (this.source === 'settings') {
      this.navController.navigateBack('/tabs/settings');
    } else {
      this.navController.navigateBack('/tabs/lent');
    }
  }

}
