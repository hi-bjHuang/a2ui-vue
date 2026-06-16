import {Catalog} from '@a2ui/web_core/v0_9';
import {BASIC_FUNCTIONS} from '@a2ui/web_core/v0_9/basic_catalog';
import {z} from 'zod';
import type {VueComponentImplementation} from '../../adapter';

import TextVue from './components/Text.vue';
import ImageVue from './components/Image.vue';
import IconVue from './components/Icon.vue';
import VideoVue from './components/Video.vue';
import AudioPlayerVue from './components/AudioPlayer.vue';
import RowVue from './components/Row.vue';
import ColumnVue from './components/Column.vue';
import ListVue from './components/List.vue';
import CardVue from './components/Card.vue';
import TabsVue from './components/Tabs.vue';
import DividerVue from './components/Divider.vue';
import ModalVue from './components/Modal.vue';
import ButtonVue from './components/Button.vue';
import TextFieldVue from './components/TextField.vue';
import CheckBoxVue from './components/CheckBox.vue';
import ChoicePickerVue from './components/ChoicePicker.vue';
import SliderVue from './components/Slider.vue';
import DateTimeInputVue from './components/DateTimeInput.vue';
import TableVue from './components/Table.vue';

import {
  TextApi, ImageApi, IconApi, VideoApi, AudioPlayerApi,
  RowApi, ColumnApi, ListApi, CardApi, TabsApi,
  DividerApi, ModalApi, ButtonApi, TextFieldApi,
  CheckBoxApi, ChoicePickerApi, SliderApi, DateTimeInputApi,
} from '@a2ui/web_core/v0_9/basic_catalog';

const TableApi = {
  name: 'Table',
  schema: z.object({
    columns: z
      .array(
        z.object({
          key: z.string().describe('The field key to read from each row object.'),
          label: z.string().describe('The column header label.'),
          width: z.string().optional().describe('Optional CSS width for the column.'),
        }),
      )
      .describe('Column definitions for the table.'),
    rows: z
      .union([
        z.array(z.record(z.any())),
        z.object({
          path: z.string().describe('A JSON Pointer path to a row array in the data model.'),
        }),
      ])
      .describe('Rows to render, either inline or as a data binding.'),
    striped: z.boolean().optional().describe('Whether odd rows use a subtle alternate background.'),
    bordered: z.boolean().optional().describe('Whether cells render borders.'),
    weight: z.number().optional(),
  }),
};

const makeImpl = (api: {name: string; schema: unknown}, component: unknown): VueComponentImplementation => ({
  name: api.name,
  schema: api.schema as VueComponentImplementation['schema'],
  component: component as VueComponentImplementation['component'],
});

const basicComponents: VueComponentImplementation[] = [
  makeImpl(TextApi, TextVue),
  makeImpl(ImageApi, ImageVue),
  makeImpl(IconApi, IconVue),
  makeImpl(VideoApi, VideoVue),
  makeImpl(AudioPlayerApi, AudioPlayerVue),
  makeImpl(RowApi, RowVue),
  makeImpl(ColumnApi, ColumnVue),
  makeImpl(ListApi, ListVue),
  makeImpl(CardApi, CardVue),
  makeImpl(TabsApi, TabsVue),
  makeImpl(DividerApi, DividerVue),
  makeImpl(ModalApi, ModalVue),
  makeImpl(ButtonApi, ButtonVue),
  makeImpl(TextFieldApi, TextFieldVue),
  makeImpl(CheckBoxApi, CheckBoxVue),
  makeImpl(ChoicePickerApi, ChoicePickerVue),
  makeImpl(SliderApi, SliderVue),
  makeImpl(DateTimeInputApi, DateTimeInputVue),
  makeImpl(TableApi, TableVue),
];

export const basicCatalog = new Catalog<VueComponentImplementation>(
  'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
  basicComponents,
  BASIC_FUNCTIONS,
);

export {
  TextVue as Text,
  ImageVue as Image,
  IconVue as Icon,
  VideoVue as Video,
  AudioPlayerVue as AudioPlayer,
  RowVue as Row,
  ColumnVue as Column,
  ListVue as List,
  CardVue as Card,
  TabsVue as Tabs,
  DividerVue as Divider,
  ModalVue as Modal,
  ButtonVue as Button,
  TextFieldVue as TextField,
  CheckBoxVue as CheckBox,
  ChoicePickerVue as ChoicePicker,
  SliderVue as Slider,
  DateTimeInputVue as DateTimeInput,
  TableVue as Table,
};

export * from './composables/useMarkdownRenderer';
