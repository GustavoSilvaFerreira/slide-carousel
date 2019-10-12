import { Component, OnInit } from '@angular/core';
import { URL_API, URL_HOST_IMG } from 'src/app.api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-picture-instagran',
  templateUrl: './picture-instagran.component.html',
  styleUrls: ['./picture-instagran.component.css']
})
export class PictureInstagranComponent implements OnInit {

  urlHostImg = '';
  picture: any = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.urlHostImg = URL_HOST_IMG;
    this.getPicture();

    setInterval(() => {
      this.getPicture();
    }, 300000);
  }

  getPicture() {
    // exemplo de retorno da API = ['imagem.png', 'imagem.jpg']
    // no html é setado o caminho até a imagem + nome da imagem do array
    return this.httpClient.get(`${URL_API}/picture`)
      .subscribe((picture: any) => {
        if(picture.length > 0) {
          const pictureAtual = picture.filter((picture: any) => {
            return this.picture.indexOf(picture) === -1;
          });
          if (pictureAtual.length > 0) {
            // tslint:disable-next-line: forin
            for(let pic in pictureAtual) {
              this.picture.push(pictureAtual[pic]);
            }
          }
        }
      });
  }

}
