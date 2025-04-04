import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { CardComponent } from "../../../../shared/components/card/card.component";

@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    styleUrl: './description.component.scss',
    imports: [CardComponent, NgxEditorModule, FormsModule]
})

export class DescriptionComponent {

    public html = '';
    public editor: Editor;
  
    ngOnInit(): void {
      this.editor = new Editor();
    }
  
    ngOnDestroy(): void {
      this.editor.destroy();
    }

}
