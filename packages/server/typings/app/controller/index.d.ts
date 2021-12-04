// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBase from '../../../app/controller/base';
import ExportBiliBili from '../../../app/controller/biliBili';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    base: ExportBase;
    biliBili: ExportBiliBili;
    home: ExportHome;
  }
}
