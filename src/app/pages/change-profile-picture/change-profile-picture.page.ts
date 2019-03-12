import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Chooser } from '@ionic-native/chooser/ngx';
import { GlobalService } from 'src/app/services/global/global.service';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-change-profile-picture',
  templateUrl: './change-profile-picture.page.html',
  styleUrls: ['./change-profile-picture.page.scss'],
})
export class ChangeProfilePicturePage implements OnInit {

  file: Blob;
  fileIsUploaded: boolean;

  constructor(
    private navController: NavController,
    private chooser: Chooser,
    private glb: GlobalService,
    private wbma: WbmaService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  choosePicture() {
    this.chooser.getFile('image/*').then(uploadedFile => {
      if ( uploadedFile ) {
        const uploadedImage: any = document.getElementById('uploadedImage');
        this.file = new Blob([uploadedFile.data], { type: uploadedFile.mediaType });
        uploadedImage.src = uploadedFile.dataURI;
        this.fileIsUploaded = true;
      } else {
        this.fileIsUploaded = false;
      }
    })
    .catch((e) => {
      console.log(e.error);
      this.fileIsUploaded = false;
    });
  }

  async uploadFile() {
    const loading = await this.loadingController.create({ 
      message: 'Uplading...', 
      duration: 9000 });
    await loading.present();
    const formData = new FormData();
    formData.append('title', 'lender-profile-picture');
    formData.append('description', 'lender-profile-picture');
    formData.append('file', this.file);
    this.wbma.uploadFile(formData)
    this.wbma.uploadFile(formData)
    .subscribe((res: any) => {
      if ( res.message === 'File uploaded' ) {
        this.wbma.addTagToFile(parseInt(res.file_id, 10), this.wbma.getAppTag()).subscribe((tag) => {
          if ( tag.message === 'Tag added' ) {
            setTimeout(() => {
              loading.dismiss();
              this.goBack();
             }, 2000); // 2000ms delay for thumbnail-creation ;)
          } else {
            loading.dismiss();
            this.glb.messagePrompt('Media upload failed', 'Tag adding failed');
          }
        });
      } else {
        loading.dismiss();
        this.glb.messagePrompt('Media upload failed', 'File upload failed.');
      }
    });
  }

  goBack() {
    this.navController.navigateBack('/my-profile');
  }

}
